import supabase from "./supabase";

export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error("cabin data not fetched", error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    throw new Error("Cabin not deleted");
  }
}

export async function addCabin(newCabin) {
  // Handle image upload if an image file was provided
  // Check if image is a FileList/File and not just a string (from existing data)
  if (
    newCabin.image &&
    newCabin.image.length > 0 &&
    newCabin.image[0] instanceof File
  ) {
    const imageFile = newCabin.image[0];

    // Convert file to base64 data URL for storage in the database
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        // Store the base64 data URL in the image field
        newCabin.image = reader.result;

        const { data, error } = await supabase
          .from("cabins")
          .insert([newCabin])
          .select();

        if (error) {
          reject(new Error("Cabin could not be created."));
        } else {
          resolve(data);
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read image file"));
      };

      reader.readAsDataURL(imageFile);
    });
  }

  const { data, error } = await supabase
    .from("cabins")
    .insert([newCabin])
    .select();

  if (error) {
    throw new Error("Cabin could not be created.");
  }

  return data;
}

export async function updateCabin(newCabin, id) {
  // Handle image upload if a new image file was provided
  // Check if image is a FileList/File and not just a string (from existing data)
  if (
    newCabin.image &&
    newCabin.image.length > 0 &&
    newCabin.image[0] instanceof File
  ) {
    const imageFile = newCabin.image[0];

    // Convert file to base64 data URL for storage in the database
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        // Store the base64 data URL in the image field
        newCabin.image = reader.result;

        const { data, error } = await supabase
          .from("cabins")
          .update(newCabin)
          .eq("id", id)
          .select();

        if (error) {
          reject(new Error("Cabin could not be updated"));
        } else {
          resolve(data);
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read image file"));
      };

      reader.readAsDataURL(imageFile);
    });
  }

  // Don't include image field if it's empty or not a valid string
  if (!newCabin.image || typeof newCabin.image !== "string") {
    delete newCabin.image;
  }

  const { data, error } = await supabase
    .from("cabins")
    .update(newCabin)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error("Cabin could not be updated");
  }

  return data;
}

export async function getCabinsById(id) {
  let { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Cabin id details not fetched");
  }

  return data;
}
