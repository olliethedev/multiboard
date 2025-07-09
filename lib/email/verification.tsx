export function getVerificationEmailContent(name: string) {
  return (
    <>
      <p>{`Hello ${name},`}</p>
      <p>Click the button below to verify your email address.</p>
    </>
  );
}
