const submitProductsHandler = async (e) => {
  e.preventDefault();
  /*  const storeName = "Aa";
    products.push({ name, price, description, category });
    try {
      const { data } = await axios.patch("/api/qr/menus/menu", {
        storeName,
        products,
      });
    } catch (err) {
      console.log(err);
    }*/
};
const categories = [
  ...new Set(menu?.menu[0].products.map((product) => product.category)),
];

{/* <form onSubmit={submitProductsHandler}>
                <List className={styles.list}>
                  <h3 className={styles.header}>Ürün Ekle</h3>
                  <ListItem>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="category"
                      label="Kategori"
                      inputProps={{ type: "text" }}
                      onChange={(e) => setCategory(e.target.value)}
                      helperText="İpucu: Ana Yemek, Kahvaltılar, Tatlılar"
                    ></TextField>
                  </ListItem>
                  <ListItem>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="name"
                      onChange={(e) => setName(e.target.value)}
                      label="Ürün Adı"
                      inputProps={{ type: "text" }}
                      helperText="İpucu: Izgara Köfte, Kaşarlı Tost, Sufle"
                    ></TextField>
                  </ListItem>
                  <ListItem>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="description"
                      label="Ürün Açıklaması"
                      onChange={(e) => setDescription(e.target.value)}
                      inputProps={{ type: "text" }}
                      helperText="İpucu: 200GR Köfte; Patates kızartması, közlenmiş biber, soğan, domates, baharatlar, turşu ile"
                    ></TextField>
                  </ListItem>
                  <ListItem>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="price"
                      onChange={(e) => setPrice(e.target.value)}
                      label="Fiyat"
                      inputProps={{ type: "number" }}
                      helperText="İpucu: 50"
                    ></TextField>
                  </ListItem>
                  <ListItem>
                    <label htmlFor="icon-button-file">
                      <Input
                        accept="image/*"
                        id="icon-button-file"
                        type="file"
                      />
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                      >
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </ListItem>
                  <ListItem>
                    <Button
                      variant="contained"
                      type="submit"
                      fullWidth
                      color="primary"
                      onSubmit={submitProductsHandler}
                    >
                      Ekle
                    </Button>
                  </ListItem>
                </List>
              </form> */}
            </div>
            {/*  <div>
           
             
            </div> */}