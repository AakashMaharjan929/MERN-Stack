export const meta = () => {
  return [
    { title: "ResumeAI | Auth" },
    { name: "description", content: "Log into your account" },
  ];
};  

const auth = () => {
  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center ">
        <div className="gradient-border shadow-lg">
            <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1>Welcome</h1>
                    <h2>Log In to Continue your Job Journey</h2>
                </div>
            </section>
        </div>
    </main>
  )
}

export default auth