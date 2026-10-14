import VerifyEmailForm from './VerifyEmailForm';

export default async function VerifyEmailPage({ searchParams }) {
  const params = await searchParams;
  const email = typeof params?.email === 'string' ? params.email : '';
  return <VerifyEmailForm email={email} />;
}
