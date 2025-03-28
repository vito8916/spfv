import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from 'fs'
import { updateUser } from "@/app/actions/users";

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
        
        //Load the OPRA PDF template from disk.
        const pdfPath = path.join(process.cwd(), 'public', 'legal-docs', 'OPRA_B-1_Draft.pdf')

        const existingPdfBytes = fs.readFileSync(pdfPath)

         const fileName = `opra_agreement_${userId}_${Date.now()}.pdf`

         const { error: uploadError } = await supabase.storage
            .from('legal-docs')
            .upload(fileName, existingPdfBytes, {
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
        console.error('Error filling OPRA PDF:', error)
        return NextResponse.json({error: 'Failed to fill OPRA PDF'}, {status: 500})
    }
}