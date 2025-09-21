import { extendTheme } from '@chakra-ui/react'; 

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.800',
        color: 'whiteAlpha.900',
      },
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});

export default theme;