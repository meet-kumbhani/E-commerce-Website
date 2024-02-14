import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Header/Header'
import './description.css'
import Grid from '@mui/material/Unstable_Grid2';
import CurrencyRupee from '@mui/icons-material/CurrencyRupee';
import { Button, Checkbox, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Drawer from '@mui/material/Drawer';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Linkbar from '../LinkBar/Linkbar';
import axios from 'axios'

var drawerWidth = 530;

export default function Description({ updateTotalQuantity }) {

    const { productId } = useParams();
    const [allProducts, setAllProducts] = useState([]);
    const [product, setProduct] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [openproduct, setOpenproduct] = React.useState(true);
    const [openabout, setOpenabout] = React.useState(true);
    const [showAddButton, setShowAddButton] = useState(true);
    const [cartjsondata, setCartjsondata] = useState([]);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        fetchAllData();
        fetchCartData();
    }, [productId, allProducts]);

    useEffect(() => {
        const findQuantity = cartjsondata.find(p => p.productId === productId);
        setQuantity(findQuantity?.quantity || 0);
        fetchAllQuantity();

    }, [cartjsondata, productId]);

    const fetchAllData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/products_description");
            const allProducts = response.data;
            const selectedProduct = allProducts.find(item => item.id === parseInt(productId, 10));
            setProduct(selectedProduct);
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };
    
    const fetchCartData = async () => {
        try {
            const cartresponse = await axios.get("http://localhost:5000/cart");

            const cartdata = cartresponse.data.slice(1);
            const cartjsonproductID = cartdata.map(item => item.productId);

            const filteredProducts = cartjsonproductID.find(p => p.includes(productId));
            setCartjsondata(cartdata);
            setShowAddButton(!filteredProducts);

        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    }


    const addToCart = async () => {
        try {
            await axios.post('http://localhost:5000/cart', { quantity: 1, productId });
            setShowAddButton(false)
            setQuantity(1)
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const updateQuantity = async (index, newquantity) => {
        try {
            setQuantity(newquantity);
            const findQuantity = cartjsondata.find(p => p.productId === productId);
            const productIdToUpdate = findQuantity?.id
            await axios.put(`http://localhost:5000/cart/${productIdToUpdate}`, { "quantity": newquantity, "productId": productId });
            fetchCartData()

        } catch (error) {
            console.error('Error updating item quantity in cart:', error);
        }
    };

    function fetchAllQuantity() {
        const allQuantity = cartjsondata.map(p => p.quantity);
        const totalQuantity = allQuantity.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        updateTotalQuantity(totalQuantity)
    }

    const handleClickAbout = () => {
        setOpenabout(!openabout);
    };
    const handleClickProduct = () => {
        setOpenproduct(!openproduct);
    };

    const handleClickOpen = (index) => {
        setSelectedImageIndex(index);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedImageIndex(null);
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    if (!product) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

            <Linkbar /><br /><br />

            <Grid container>
                <Grid xs={4}>
                    <Drawer
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                marginTop: '70px',
                                paddingTop: '20px',
                                paddingBottom: '100px',
                                width: drawerWidth,
                                boxSizing: 'border-box',
                                overflowY: 'auto'
                            },
                        }}
                        variant="permanent"
                        anchor="left"
                    >
                        <div className='image'>
                            {product.imagePath.map((image, index) => (
                                <Button key={index} onClick={() => handleClickOpen(index)}>
                                    <img src={image} alt='logo' className='allensolly' />
                                </Button>
                            ))}
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description">
                                {selectedImageIndex !== null && (
                                    <DialogTitle id="alert-dialog-title">
                                        <img src={product.imagePath[selectedImageIndex]} alt='logo' className="widerimage" />
                                    </DialogTitle>
                                )}
                                <DialogContent align="center">{product.name}</DialogContent>

                            </Dialog>

                        </div>
                    </Drawer>
                </Grid>
                <Grid xs={5}>
                    <div className='description'>
                        <a href='/' style={{ textDecoration: 'none' }}>{product.visitlink}</a>
                        <Typography variant='h5' className='text' gutterBottom>{product.name}</Typography>
                        <Typography variant='body1' gutterBottom>{product.rating}
                            <Typography variant='body1' style={{
                                color: 'rgb(255, 200, 0)', position: 'relative', display: 'inline',
                                marginTop: '0px', paddingTop: '0px'
                            }}><i className='fas fa-star' />
                                <i className='fas fa-star' />
                                <i className='fas fa-star' />
                                <i className='fas fa-star' /></Typography>
                            <i className='fas fa-star' style={{ color: '#ddd' }} />
                        </Typography>
                        <Typography variant='p' className='pastmonth'>{product.boughttext}</Typography>
                        <hr />

                        <br />
                        <Typography variant='body1' className='price'>{product.discount}</Typography>
                        <Typography variant='body1' sx={{
                            // fontWeight: 'bold', position: 'relative', display: 'inline',
                            marginLeft: '70px', marginTop: '-50px'
                        }} fontSize='23px'>
                            <CurrencyRupee fontSize='inherit' />{product.price}</Typography><br />
                        {product.mrp}<Typography variant='p' className='striketext'><CurrencyRupee fontSize='inherit' />
                            {product.oldprice}</Typography>
                        <Typography variant='body1' style={{ fontSize: '15px' }}>{product.incltext}</Typography>
                        <hr />
                        <Typography variant='p' fontWeight='bold'>{product.size.text}</Typography>
                        <select className='size'>
                            <option>{product.size.S}</option>
                            <option>{product.size.M}</option>
                            <option>{product.size.L}</option>
                            <option>{product.size.XL}</option>
                            <option>{product.size.XXL}</option>

                        </select>
                        <ListItemButton className='productdetails' onClick={handleClickProduct}>
                            <ListItemIcon>
                                <i className='fab fa-product-hunt fa-2x'></i>
                            </ListItemIcon>
                            <ListItemText primary="Product Details" />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={openproduct} timeout="auto" unmountOnExit>
                            <TableContainer>
                                <Table sx={{ minWidth: 250 }} aria-label="simple table">
                                    <TableBody>
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell className='material' component="th" scope="row">{product.product_details[1]}</TableCell>
                                            <TableCell>{product.product_details[2]}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell className='material' component="th" scope="row">{product.product_details[3]}</TableCell>
                                            <TableCell>{product.product_details[4]}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell className='material' component="th" scope="row">{product.product_details[5]}</TableCell>
                                            <TableCell>{product.product_details[6]}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell className='material' component="th" scope="row">{product.product_details[7]}</TableCell>
                                            <TableCell>{product.product_details[8]}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell className='material' component="th" scope="row">{product.product_details[9]}</TableCell>
                                            <TableCell>{product.product_details[10]}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell className='material' component="th" scope="row">{product.product_details[11]}</TableCell>
                                            <TableCell>{product.product_details[12]}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell className='material' component="th" scope="row">{product.product_details[13]}</TableCell>
                                            <TableCell>{product.product_details[14]}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Collapse>
                        <hr />
                        <ListItemButton className='productdetails' onClick={handleClickAbout}>
                            <ListItemIcon>
                                <DescriptionIcon />
                            </ListItemIcon>
                            <ListItemText primary="About this Item" />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openabout} timeout="auto" unmountOnExit>
                            <ul>
                                <li>
                                    <Typography>{product.about[1]}</Typography>
                                </li>
                                <li>
                                    <Typography>{product.about[2]}</Typography>
                                </li>
                                <li>
                                    <Typography>{product.about[3]}</Typography>
                                </li>
                                <li>
                                    <Typography>{product.about[4]}</Typography>
                                </li>
                                <li>
                                    <Typography>{product.about[5]}</Typography>
                                </li>
                                <li>
                                    <Typography>{product.about[6]}</Typography>
                                </li>
                            </ul>
                        </Collapse>
                        <hr />

                        <Typography fontWeight='bold'
                            sx={{
                                color: 'orange',
                                fontSize: '20px'
                            }} marginTop='30px'>{product.warning}</Typography>
                        <Grid container spacing={1}>
                            <Grid xs={4}>
                                <Item>
                                    <Button variant='contained'
                                        sx={{
                                            padding: '10px 20px',
                                            width: '100px'
                                        }}>{product.limited}</Button>
                                </Item>
                            </Grid>
                            <Grid xs={8}>
                                <Item>
                                    <Typography >
                                        <b>{product.note}</b>
                                    </Typography>
                                </Item>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid xs={3}>
                    <Item sx={{ marginTop: '100px', marginRight: '20px', padding: '20px' }}>
                        <a href='/' style={{ textDecoration: 'none', fontSize: '15px', marginTop: '20px' }}>{product.freedelivery}</a>
                        {product.date}
                        <Typography variant='body1' gutterBottom
                            sx={{
                                color: 'red',
                                marginTop: '20px'
                            }}>{product.left}</Typography>
                        <Typography variant='body1' sx={{ justifyContent: 'space-between', marginTop: '20px' }}>{product.ships}
                            <Typography
                                sx={{
                                    marginLeft: '60px',
                                    display: 'inline'
                                }}>{product.amazon}</Typography></Typography>
                        <Typography variant='body1' sx={{ justifyContent: 'space-between' }}>{product.sold}
                            <Typography
                                sx={{
                                    marginLeft: '80px',
                                    display: 'inline'
                                }}>{product.cocoblu}</Typography></Typography>

                        {showAddButton ?
                            <Button variant="contained" sx={{ marginLeft: 3, marginTop: 3, height: 40 }} color='secondary'
                                onClick={addToCart} className='addtocart'> Add to cart</Button >
                            :
                            <Typography variant="body1"
                                sx={{
                                    marginTop: 3,
                                    fontWeight: 'bold',
                                    fontSize: 20
                                }}>Quantity :
                                <input type="number"
                                    style={{
                                        width: "60px",
                                        height: 23,
                                        border: '1px solid black',
                                        borderRadius: 5,
                                        marginLeft: 10,
                                        padding: 5
                                    }}
                                    onChange={(e) => updateQuantity(productId, parseInt(e.target.value))}
                                    defaultValue={quantity} />
                            </Typography>
                        }
                        <FormGroup sx={{ marginLeft: '80px', marginTop: '20px' }} >
                            <FormControlLabel control={<Checkbox />} label="Add gift options" />
                        </FormGroup>
                        <hr />
                        <Button variant='outlined' sx={{ margin: '10px' }}>Add to Wish List</Button>
                    </Item>
                </Grid>
            </Grid>
        </>
    )

}
