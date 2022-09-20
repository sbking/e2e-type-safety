export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/admin/posts",
      permanent: false,
    },
  };
}

export default function AdminIndex() {}
