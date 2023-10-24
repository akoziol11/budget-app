import AuthModule from "../Authentication/Auth.js";
export default function Main() {
  return (
    <section>
      <h1>Welcome to your personal Budget Buddy!</h1>
      <AuthModule />
    </section>
  );
}
