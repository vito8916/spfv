import {NextRequest, NextResponse} from 'next/server'
import {createClient} from "@/utils/supabase/server";
import {PDFDocument} from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import {getUserById, updateUser} from "@/app/actions/users";
import {capitalizeFullName} from "@/utils/utils";
export async function POST(req: NextRequest) {

    try {
        // get auth user from supabase
        const supabase = await createClient();
        const {data: {user}, error: authError} = await supabase.auth.getUser()
        const body = await req.json()
        const userId = body.userId

        if (authError) {
            console.error('Auth error:', authError)
            return NextResponse.json({error: 'Unauthorized'}, {status: 401})
        }

        if (!userId) {
            return NextResponse.json({error: 'Missing userId'}, {status: 400})
        }

        // compare userId with auth user
        if (user?.id !== userId) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401})
        }

        //Retrieve user data 
        const userData = await getUserById(userId);

        if (!userData) {
            return NextResponse.json({error: 'User not found'}, {status: 404});
        }

        //Load the OPRA PDF template from disk.
        const pdfPath = path.join(process.cwd(), 'public', 'legal-docs', 'opra-professional-subscriber-agreement.pdf')

        const existingPdfBytes = fs.readFileSync(pdfPath)

        // 5) Load the PDF with pdf-lib
        const pdfDoc = await PDFDocument.load(existingPdfBytes)

        // 6) Get the form from the PDF
        const form = pdfDoc.getForm()

        //7) Get all fields in the form
        const nameField = form.getTextField('subscriberFullName');
        const subscriberBusinessAddress = form.getTextField('subscriberBusinessAddress');
        const businessConductedBy = form.getTextField('businessConductedBy');
        const dated = form.getTextField('Dated');
        const nameOfSubscriber = form.getTextField('Name of Subscriber');
        //const signature = form.getTextField('Signature');
        const name = form.getTextField('Name');
       // const title = form.getTextField('Title');
        const subsciberName = form.getTextField('Notify OPRA promptly of any changes to the following information');
        const phone = form.getTextField('Bill to the attention of 4');
        const billingEmail = form.getTextField('Billing Email Address');
        const startDate = form.getTextField('Subscriber No 3');

        // 8) Fill the form fields with user data
        nameField.setText(capitalizeFullName(userData?.full_name || ''))
        subscriberBusinessAddress.setText(userData?.billing_address?.street + ', ' + userData?.billing_address?.city + ', ' + userData?.billing_address?.state + ', ' + userData?.billing_address?.postalCode);
        businessConductedBy.setText(capitalizeFullName(userData?.full_name || ''));
        dated.setText(new Date().toLocaleDateString('en-US'));
        nameOfSubscriber.setText(capitalizeFullName(userData?.full_name || ''  ));
        //signature.setText(capitalizeFullName(userData?.full_name || ''));
        name.setText(capitalizeFullName(userData?.full_name || ''));
        //title.setText(userData?.title || '');
        subsciberName.setText(userData?.full_name || '');
        phone.setText(userData?.phone || '');
        billingEmail.setText(userData?.user_email || '');
        startDate.setText(new Date().toLocaleDateString('en-US'));
        
        // 8) (Optional) "Flatten" the form so the fields become read-only text
        form.flatten()

        // 9) Save the PDF to a Buffer
        const filledPdfBytes = await pdfDoc.save()
        const fileName = `opra_agreement_${userId}_${Date.now()}.pdf`

        const { error: uploadError } = await supabase.storage
            .from('legal-docs')
            .upload(fileName, filledPdfBytes, {
                contentType: 'application/pdf',
                upsert: true,
            })
        if (uploadError) {
            throw new Error(uploadError.message)
        }

        // If bucket is private, create a signed URL (valid X seconds)
        const {data: signedUrlData, error: signedUrlError} = await supabase.storage
            .from('legal-docs')
            .createSignedUrl(fileName, 60 * 60) // 1 hour expiration

        if (signedUrlError) {
            throw new Error(signedUrlError.message)
        }

        const pdfUrl = signedUrlData.signedUrl

        // 12) Update the user record with the PDF link
        const result = await updateUser({
            opra_pdf_url: pdfUrl
        });

        if (!result.success) {
            return NextResponse.json({error: result.error}, {status: 500})
        }

        // 13) Return success
        return NextResponse.json({success: true, pdfUrl})

    } catch (error) {
        console.error('Error filling PDF:', error)
        return NextResponse.json({error: 'Failed to fill PDF'}, {status: 500})
    }

}