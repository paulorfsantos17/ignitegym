import {
  Text,
  Button as GluestackButton,
  ButtonSpinner,
} from '@gluestack-ui/themed'
import type { ComponentProps } from 'react'

interface ButtonProps extends ComponentProps<typeof GluestackButton> {
  title: string
  isLoading?: boolean
}

export default function Button({
  title,
  isLoading = false,
  ...rest
}: ButtonProps) {
  return (
    <GluestackButton
      w="$full"
      h="$14"
      bg="$green700"
      borderWidth="$0"
      borderColor="$green500"
      rounded="$sm"
      $active-bg="$green500"
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner />
      ) : (
        <Text color="$white" fontWeight="bold">
          {title}
        </Text>
      )}
    </GluestackButton>
  )
}
