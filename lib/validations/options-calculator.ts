import * as z from "zod"

export const optionsCalculatorSchema = z.object({
  symbol: z.string({
    required_error: "Please select a stock symbol",
  }),
  expirationDate: z.date({
    required_error: "Please select an expiration date",
  }),
  optionType: z.enum(["call", "put", "both"], {
    required_error: "Please select an option type",
  }).default("both"),
  strikeCount: z.enum(["1", "3", "5", "20"], {
    required_error: "Please select the number of strikes",
  }).default("20"),
})

export type OptionsCalculatorFormValues = z.infer<typeof optionsCalculatorSchema> 