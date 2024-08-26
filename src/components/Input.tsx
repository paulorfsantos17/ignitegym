import { Input as GluestackInput, InputField } from '@gluestack-ui/themed'
import type { ComponentProps } from 'react'
interface InputProps extends ComponentProps<typeof InputField> {}
export function Input({ ...rest }: InputProps) {
  return (
    <GluestackInput
      bg="$gray700"
      h="$14"
      px="$4"
      borderWidth="$0"
      borderRadius="$md"
    >
      <InputField
        color="$white"
        fontFamily="$body"
        placeholderTextColor="$gray300"
        {...rest}
      />
    </GluestackInput>
  )
}
