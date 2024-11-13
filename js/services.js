export const config = {
  api: "https://fakestoreapi.com/products",
};

export const getData = async (path) => {
  try {
    let response = await fetch(path);
    let data = await response.json();
    return data;
  } catch (error) {
    console.log("Fetch Error", error);
  }
};
