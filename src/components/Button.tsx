import {
  Text,
  Button as GluestackButton,
  ButtonSpinner,
} from '@gluestack-ui/themed'
import type { ComponentProps } from 'react'

interface ButtonProps extends ComponentProps<typeof GluestackButton> {
  title: string
  isLoading?: boolean
  variant?: 'solid' | 'outline'
}

export default function Button({
  title,
  isLoading = false,
  variant = 'solid',
  ...rest
}: ButtonProps) {
  return (
    <GluestackButton
      w="$full"
      h="$14"
      bg={variant === 'outline' ? 'transparent' : '$green700'}
      borderWidth={variant === 'outline' ? '$1' : '$0'}
      borderColor="$green500"
      rounded="$sm"
      $active-bg={variant === 'outline' ? '$gray500' : '$green500'}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner />
      ) : (
        <Text
          color={variant === 'outline' ? '$green500' : '$white'}
          fontWeight="bold"
        >
          {title}
        </Text>
      )}
    </GluestackButton>
  )
}
