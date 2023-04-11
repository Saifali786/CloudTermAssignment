import { createTheme } from "@material-ui/core";

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        multiline: {
          fontWeight: "bold",
          fontSize: "20px",
          color: "purple",
          width: "50vw",
        },
      },
    },
  },
});

export default theme;
