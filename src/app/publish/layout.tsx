import UserAuthGuard from '@/components/common/UserAuthGuard';

export default function PublishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserAuthGuard>
      {children}
    </UserAuthGuard>
  );
} 