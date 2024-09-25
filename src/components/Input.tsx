import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  Input as GluestackInput,
  InputField,
} from '@gluestack-ui/themed'
import type { ComponentProps } from 'react'
interface InputProps extends ComponentProps<typeof InputField> {
  errorMessage?: string | null
  isDisabled?: boolean
  isInvalid?: boolean
}
export function Input({
  isDisabled = false,
  errorMessage = null,
  isInvalid = false,
  ...rest
}: InputProps) {
  const invalid = !!errorMessage || isInvalid

  return (
    <FormControl isInvalid={invalid} w="$full" mb="$4">
      <GluestackInput
        h="$14"
        borderWidth="$0"
        borderRadius="$md"
        $focus={{
          borderWidth: 1,
          borderColor: invalid ? '$red500' : '$green500',
        }}
        $invalid={{ borderWidth: 1, borderColor: '$red500' }}
        isDisabled={isDisabled}
      >
        <InputField
          bg="$gray700"
          px="$4"
          color="$white"
          fontFamily="$body"
          placeholderTextColor="$gray300"
          $disabled-bgColor="$gray500"
          {...rest}
        />
      </GluestackInput>
      <FormControlError>
        <FormControlErrorText color="$red500">
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  )
}
