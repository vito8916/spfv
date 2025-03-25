import { ShieldCheck } from 'lucide-react'
import React from 'react'
import OpraForm from '@/components/registration-flow/opra-form'
export default function OpraAgreementsPage() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">OPRA Agreements</h1>
                <p className="text-muted-foreground">
                    Please review and accept our OPRA agreements to continue with your subscription
                </p>
            </div>
            <OpraForm />
        </div>
  )
}
