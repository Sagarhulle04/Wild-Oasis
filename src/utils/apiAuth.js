import supabase from "./supabase";

async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function getCurrentuser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function signUp({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { fullName, avatar: "" },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function updateUser({ password }) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export { login, signUp, getCurrentuser, logout, updateUser };
