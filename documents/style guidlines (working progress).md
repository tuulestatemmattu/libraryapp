# Sovelluksen tyylin tekemisen ohjeet (ehdotus)

- Käytössä on globaali [mui theme](https://mui.com/material-ui/customization/theming/) jolla hallinnoidaan
  - värejä [muin palette](https://mui.com/material-ui/customization/palette/):lla
  - Skaalausta fonttikoolla ja [brakepointeilla](https://mui.com/material-ui/customization/breakpoints/)
    - Ajatuksena olisi että kaikkien muiden komponenttejen koko voidaan määrätä fonttikoon mukaan
  - Ja joitain globaleja muutoksia mui [komponenttejen tyyliin](https://mui.com/material-ui/customization/theme-components/)
- Käytössä on .css tiedostot joissa hallinnoidaan
  - EI VÄREJÄ
    - Värit määritellään teemassa ja niitä voi käyttää sx tai style propeissa tsx tiedostoissa
  - Komponenttejen koon hienosäätöä 
    - Pyrittäis siihen et kaikki koot sun muut määriteltäis jollain tavalla suhteessa fonttikokoon
