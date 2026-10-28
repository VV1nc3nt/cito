import { Icon, type IconProps } from './Icon'

export type { IconProps }

export const BuildingIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" />
  </Icon>
)

export const ChartIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 20h18M6 16l4-5 3 3 5-7" />
  </Icon>
)

export const LayersIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />
  </Icon>
)

export const NewsIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 4h11a2 2 0 0 1 2 2v13a1 1 0 0 0 2 0V8M5 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h15M8 8h6M8 12h6M8 16h4" />
  </Icon>
)

export const DocIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4" />
  </Icon>
)

export const PhoneIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </Icon>
)

export const MailIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
  </Icon>
)

export const EyeIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
)

export const ChevronIcon = (props: IconProps) => (
  <Icon strokeWidth={2} {...props}>
    <path d="M9 6l6 6-6 6" />
  </Icon>
)

export const CloseIcon = (props: IconProps) => (
  <Icon strokeWidth={2} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
)
