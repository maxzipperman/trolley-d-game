import { clsx, type ClassValue } from "clsx"
import { mergeTailwindClasses } from "./tailwind-utils"

export function cn(...inputs: ClassValue[]) {
  const classString = clsx(inputs);
  return mergeTailwindClasses(classString);
}
