export function getResetPasswordEmailContent(name: string) {
  return (
    <>
      <p>Hello {name},</p>
      <p>
        We received a request to reset your password. If you didn&apos;t make
        this request, you can safely ignore this email.
      </p>
    </>
  );
}
