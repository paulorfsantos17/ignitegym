import { Image } from '@gluestack-ui/themed'
import type { ComponentProps } from 'react'

type UserPhotoProps = ComponentProps<typeof Image> & { alt: string }

export default function UserPhoto({ alt, ...rest }: UserPhotoProps) {
  return (
    <Image
      alt={alt}
      rounded="$full"
      borderWidth="$2"
      borderColor="$gray400"
      backgroundColor="gray500"
      {...rest}
    />
  )
}
