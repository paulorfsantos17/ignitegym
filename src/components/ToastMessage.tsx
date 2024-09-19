import {
  Icon,
  Pressable,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
} from '@gluestack-ui/themed'
import { X } from 'lucide-react-native'

interface ToastMessageProps {
  id: string
  title: string
  description?: string
  action?: 'success' | 'error'
  onClose: () => void
}

export default function ToastMessage({
  id,
  onClose,
  title,
  action = 'success',
  description,
}: ToastMessageProps) {
  return (
    <Toast
      nativeID={`toast-${id}`}
      action={action}
      bg={action === 'success' ? '$green500' : '$red500'}
      mt="$10"
    >
      <VStack space="xs" w="$full">
        <Pressable alignSelf="flex-end" onPress={onClose}>
          <Icon as={X} color="$coolGray50" size="md" />
        </Pressable>
        <ToastTitle color="$white" fontFamily="$heading" alignSelf="center">
          {title}
        </ToastTitle>
        {description && (
          <ToastDescription color="$white" fontFamily="$body">
            {description}
          </ToastDescription>
        )}
      </VStack>
    </Toast>
  )
}
