export function getInvitationEmailContent(
  name: string,
  invitedByUsername: string,
  teamName: string
) {
  return (
    <>
      <p>Hello {name},</p>
      <p>
        {invitedByUsername} has invited you to the {teamName} team on
        Multiboard.
      </p>
    </>
  );
}
