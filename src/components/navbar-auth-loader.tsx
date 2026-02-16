// components/navbar/navbar-auth-loader.tsx
type Props = {
  mobile?: boolean;
};

export default function NavbarAuthLoader({ mobile }: Props) {
  return <div className="h-9 w-20 rounded bg-muted animate-pulse" />;
}
