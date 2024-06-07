const bcrypt = require("bcrypt");

const plainPassword = "1234";
let password;

const generatePassword = async () => {
  const salt = await bcrypt.genSalt(12);
  password = await bcrypt.hash(plainPassword, salt);
  console.log(password);
};

const matchPassword = async () => {
  console.log(
    await bcrypt.compare(
      plainPassword,
      //   "$2b$12$bU0xZxP3H7DxuziGSHBhaeoOIf1ixlzXGOxyW7Zi4SJVK01seAWXe"
      //   "$2b$12$GvQNl8eSQX8gd9bekynizu1WflAKqpqa5X02s2nF6i3SZ1qvNUmjC"
      //   "$2b$12$GvQNl8eSQX8gd9bekynizu1WflAKqpqa5X02s2nF6i3SZ1qvNUmjC"
      "$2b$12$6dNyQreGYTd6Z40J4zFKDOpQRhfWRSVLoJW3N7r1hWAAGi1v68yYq"
    )
  );
};
// SAlT $2b$12$GvQNl8eSQX8gd9bekynizu
//$2b$12$832Fl9B5N2Yi4RVSXvrufe
// $2b$12$CZ70XAKQEDUt63F2zcsXuO

// $2b$12$wmE.oAejOpHwr4N7BZkj8u7qyzjmjkGZZ6WN7.XL1zEvIV47PT3Hm;
// $2b$12$bU0xZxP3H7DxuziGSHBhaeoOIf1ixlzXGOxyW7Zi4SJVK01seAWXe
// generatePassword();
matchPassword();
