import { listAdmins } from "@/lib/cms/repo";
import { currentAdmin } from "@/lib/admin-session";
import { Badge, Card, Field, Flash, Input, PageHeader, Table } from "@/components/admin/ui";
import { ConfirmButton, SubmitButton } from "@/components/admin/buttons";
import { addAdmin, changePassword, removeAdmin } from "./actions";

export default async function TeamAdmin(props: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await props.searchParams;
  const [admins, me] = await Promise.all([listAdmins(), currentAdmin()]);

  return (
    <>
      <PageHeader title="Team" description="Who can sign in to this panel. Everyone sees everything; keep it to the people who run the studio." />
      <Flash saved={saved} error={error} />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Table head={["Person", "Role", "Added", ""]}>
          {admins.map((a) => (
            <tr key={a._id}>
              <td className="px-4 py-3">
                <span className="block text-ink">{a.name}</span>
                <span className="font-mono text-[10px] text-ink-3">{a.email}</span>
              </td>
              <td className="px-4 py-3">
                <Badge tone={a.role === "owner" ? "ink" : "neutral"}>{a.role}</Badge>
              </td>
              <td className="px-4 py-3 font-mono text-[11px] text-ink-3">{new Date(a.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-right">
                {a._id !== me?.sub && (
                  <form action={removeAdmin}>
                    <input type="hidden" name="id" value={a._id} />
                    <ConfirmButton message={`Remove ${a.name}'s access?`}>Remove</ConfirmButton>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </Table>

        <div className="space-y-6">
          <Card title="Add a person">
            <form action={addAdmin} className="space-y-4">
              <Field label="Name" name="name"><Input name="name" /></Field>
              <Field label="Email" name="email"><Input name="email" type="email" required /></Field>
              <Field label="Password" name="password" hint="At least 10 characters. They can change it once signed in."><Input name="password" type="password" required minLength={10} /></Field>
              <SubmitButton className="w-full">Add</SubmitButton>
            </form>
          </Card>
          <Card title="Change my password">
            <form action={changePassword} className="space-y-4">
              <Field label="New password" name="password"><Input name="password" type="password" required minLength={10} autoComplete="new-password" /></Field>
              <SubmitButton className="w-full">Change</SubmitButton>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
