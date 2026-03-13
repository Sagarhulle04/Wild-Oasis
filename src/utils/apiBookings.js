import supabase from "./supabase";

async function allBookings() {
  let { data, error, count } = await supabase
    .from("bookings")
    .select("*, cabins(name), guests(fullName, email)");

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(error.message);
  }
  return data;
}

async function bookingId(id) {
  let { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Booking Id not found");
  }

  return data;
}

async function updateBooking(id, newBooking) {
  const { data, error } = await supabase
    .from("bookings")
    .update(newBooking)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Update to the data failed in the booking");
  }

  return data;
}

async function deleteBooking(id) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) throw new Error("Booking Not Deleted");
}

export { allBookings, bookingId, updateBooking, deleteBooking };
