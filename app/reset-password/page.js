import ResetPasswordForm from './ResetPasswordForm';

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const email = typeof params?.email === 'string' ? params.email : '';
  return <ResetPasswordForm email={email} />;
}
