import * as z from "zod"

export const optionsCalculatorSchema = z.object({
  symbol: z.string({
    required_error: "Please select a stock symbol",
  }),
  expirationDate: z.date({
    required_error: "Please select an expiration date",
  })
})

export type OptionsCalculatorFormValues = z.infer<typeof optionsCalculatorSchema> 