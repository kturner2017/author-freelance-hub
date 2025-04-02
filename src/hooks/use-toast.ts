
// This implementation is based on shadcn/ui toast pattern
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

import {
  useToast as useToastPrimitive,
} from "@/lib/use-toast"

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

export const useToast = useToastPrimitive

export { toast } from "@/lib/use-toast"
