import React, {
  useState,
  useRef,
  useEffect,
  useCallback
} from "react";

import fleekStorage from "@fleekhq/fleek-storage-js";

import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  Divider,

} from "@material-ui/core";

import { 
  makeStyles,

} from "@material-ui/core/styles";

import {
  AttendeesTable,

} from "../components";

import {
  importCSV
} from "../utils/csv";

import {
  importImage,
  storeImageTextile,
  storeImageFirebase,
  uploadToFleek,
} from "../utils/image";

import {
  checkAccountIds,

} from "../utils/wallet"


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  button: {
    marginRight: 20,
  },
  step: {
    marginBottom: 5
  }
  
}));

// Dirty solution :/
// hasDeposit is define outside of CreateNewBadges Hook in order to avoid "calling a setDeposit = setState() inside of a useEffect" warning.
// hasDeposit is set true by default so it does not show up when redirect from Depositing NEAR Wallet Page back to the dApp.
let hasDeposit = true;

export default function CreateNewBadges() {
  console.log('call me once?');
  const classes = useStyles();
  const [attendees, setAttendees] = useState([]);
  const [accountsNotExist, setAccountsNotExist] = useState([]);
  const [nftImage, setNFTImage] = useState(null);
  const [filePath, setFilePath] = useState("/Users/jedi/dOrg/NEAR/proof-of-attendance/src/constants/kobe-gianna.png");
  const [imageFile, setImageFile] = useState(null);
  const inputCSVFile = useRef(null);
  const inputImageFile = useRef(null);

  // This temp variable is used to store the user's nft image while it gets processed
  const [pic, setPic] = useState(null);

  // const [hasDeposit, setDeposit] = useState(false);
  const imageAlt = "image not successfully uploaded"

  const componentDidMount = () => {
    checkHasDeposit()
  }
  
  useEffect(componentDidMount, []);

  // Hook to set the user nft image everytime it changes
  useEffect(() => {
    if (pic) {
      const reader = new FileReader();
        reader.onloadend = () => {
          setNFTImage(reader.result);
        }
      reader.readAsDataURL(pic);
   } else {
     setNFTImage(null);
   }
  }, [pic])
  
  const checkHasDeposit = async () => {
    const deposit = await window.api.hasDeposit();
    if(deposit) {
      console.log("if deposit", deposit);
      console.log("if hasDeposit", hasDeposit);
      hasDeposit = true;
      // the below line is commentted to avoid calling setState inside of a hook 
      // setDeposit(deposit)
    }
    else {
      console.log("else deposit", deposit);
      hasDeposit = false;
    }
  }
  
  const csvUpload = () => {
    inputCSVFile.current.click();
  }

  const onCSVUpload = (event) => {
    const csv = importCSV(event, setAttendees);
  }
  
  const validateNEARAccounts = () => {
    checkAccountIds(attendees, setAttendees, setAccountsNotExist)
  }

  const addDeposit = async () => {
    try {
      const deposit = await window.api.addDeposit();
      checkHasDeposit()
    } catch (error) {
      console.log('error in add deposit');
    }
  }
  
  const uploadImage = (image) => {
    setNFTImage(image)
  }

  const onChangeImageUpload = async (event) => {
    // Had to comment this because it gave too many erros
    //const image = await importImage(event, uploadImage, setImageFile);
    const file = event.target.files[0];
    // Just to make sure the user doesn't upload anything but an image
    return file && file.type.substr(0,5) ? setPic(file) : setPic(null);
  }
  
  const onClickStoreImageTextile = () => {
    storeImageTextile(nftImage);
  }
  
  const onClickStoreImageFirebase = () => {
    storeImageFirebase(imageFile, nftImage);
  }
  
  const onClickFleekUpload = () => {
    uploadToFleek(imageFile.name, nftImage);
  }
    
  const onClickUploadImage = () => {
    inputImageFile.current.click();
  } 
  
  const mintNFTs = () => {
    console.log("here we all data(csv of attendees & nft image) gathered from UI and its sent to our server for it to be mint to all corresponding account id's")
    console.log('attendees', attendees);
    console.log('accountsNotExist', accountsNotExist);
    console.log('nftImage', nftImage);
  }
  
  return (
    <Box>
      <Typography variant="subtitle1">
        Create New Badges
      </Typography>
      <br />
      <Grid container spacing={3}>
        {/* column 1 */}
        <Grid item xs={6}>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Box>
                  {
                    nftImage ? (
                      <img src={nftImage} alt={imageAlt} width={100} style={{ maxWidth: 200}}/>
                    ) : (
                      "Here we display how the NFT media looks like"
                    )
                  }
                </Box>  
              </Paper>
            </Grid>
            
            <br />
            <Grid item xs={12}>
              <Typography variant="subtitle2" className={classes.step}>STEP 1:</Typography>
              <input type="file" ref={inputCSVFile} style={{display: "none"}} onChange={onCSVUpload}/>
              <Button variant="contained" onClick={csvUpload}>
                CSV Upload
              </Button>
            </Grid>
            
            <br />
            <Grid item xs={12}>
              <Typography variant="subtitle2" className={classes.step}>STEP 2:</Typography>
              <Button variant="contained" onClick={validateNEARAccounts}>
                Validate NEAR Accounts
              </Button>
            </Grid>
          
            {
              !hasDeposit && (
                <>
                  <br/>
                  <Grid item xs={12}>  
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" className={classes.step}>
                        Before uploading NFT first deposit NEAR
                      </Typography>
                      <Button variant="contained" onClick={addDeposit}>
                        Add Deposit
                      </Button>
                    </Grid> 
                  </Grid>
                </>
              )
            }
            <br />
            <Grid item xs={12}>
              <Typography variant="subtitle2" className={classes.step}>STEP 3:</Typography>
              <input type="file" ref={inputImageFile} accept="image/*" style={{display: "none" }} onChange={onChangeImageUpload}/>
              <Button variant="contained" onClick={onClickUploadImage}>
                Upload JPEG/NFT
              </Button>
            </Grid>
            
            <br />
            <Grid item xs={12}>
                <Typography variant="subtitle2" className={classes.step}>STEP 4:</Typography>
                <Button variant="contained" className={classes.button} onClick={onClickFleekUpload}>
                  Store Fleek
                </Button>                

                <Button variant="contained" className={classes.button} onClick={onClickStoreImageFirebase}>
                  Store Firebase
                </Button>                

                <Button variant="contained" className={classes.button} onClick={onClickStoreImageTextile}>
                  Store Textile
                </Button>             
            </Grid>
            
            <br />

            <Grid item xs={12}>
              <Typography variant="subtitle2" className={classes.step}>STEP 5:</Typography>
              <Button variant="contained" onClick={mintNFTs}>
                Mint NFT
              </Button>
            </Grid>
            
          </Grid>
        </Grid>    
        
        {/* column 2 */}
        <Grid item xs={6}>
          <Grid item xs={12}>
            <AttendeesTable attendees={attendees} />
          </Grid>

          <br/>
          <Grid item xs={12}>
            {
              // For some weird reason we need to call setAccountsNotExist even though we are not rendering the below table.
              accountsNotExist.length > 0 && (
                <Box>
                  These Wallet ID's do not exist
                  <br/>
                  <br/>
                  <AttendeesTable attendees={accountsNotExist} />
                </Box>
              )
            }
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}


