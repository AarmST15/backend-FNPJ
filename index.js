var express = require('express')
const sql = require("mssql")
var cors = require('cors')
var bodyParser = require('body-parser')
const qrCode = require('qrcode')
const generatePayload = require('promptpay-qr')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { check, validationResult, param, Result } = require("express-validator");

const {
    menuItem,
    deleteMenu,
    MenuByType,
    cafeInfo,
    employeeList,
    AddEmployee,
    CustomerList,
    Register,
    cafeOrder,
    cafeOrderById,
    cafeOrderStatement,
    cafeOrderIncome,
    addMenu,
    addOrder,
    deleteOrder,
    deleteMember,
    updatePoint,
    updatePrice,
    cafeComment,
    createComment,
    updateStatus,
    getOrderCafe
} = require("./model/cafe.model");

require('dotenv').config()

const CustomerformsaveDataValidator = [
    check("menuId").not().isEmpty().withMessage("Please input your menu id"),
    check("menuName").not().isEmpty().withMessage("Please input your menu name"),
    check("price").not().isEmpty().withMessage("Please input your price"),
    check("menuDetail").not().isEmpty().withMessage("Please input your menu detail"),
    check("menuType").not().isEmpty().withMessage("Please input your menu type"),
    check("menuPic").not().isEmpty().withMessage("Please input your menu picture"),
];

const OrderformsaveDataValidator = [
    check('orderId').not().isEmpty().withMessage('Please input order id'),
    check('cusName').not().isEmpty().withMessage('Please input your customer name'),
    check('menuName').not().isEmpty().withMessage('Please input your menu'),
    check('unit').not().isEmpty().withMessage('Please input unit'),
    check('total').not().isEmpty().withMessage('Please input total amount')
];

const RegisterformsaveDataValidator = [
    check("cusId").not().isEmpty().withMessage("Please input date order"),
    check("cusName").not().isEmpty().withMessage("Please input order id"),
    check("cusEmail").not().isEmpty().withMessage("Please input your customer id"),
    check("cusPassword").not().isEmpty().withMessage("Please input your menu"),
    check("cusPoint").not().isEmpty().withMessage("Please input unit"),
]

const AddStaffformsaveDataValidator = [
    check("emId").not().isEmpty().withMessage("Please input id"),
    check("emName").not().isEmpty().withMessage("Please input name"),
    check("emEmail").not().isEmpty().withMessage("Please input your email"),
    check("emPassword").not().isEmpty().withMessage("Please input your password"),
]

const CommentformsaveDataValidator = [
    check("comName").not().isEmpty().withMessage("Please input your name"),
    check("comBody").not().isEmpty().withMessage("Please input comment"),
]

var app = express()
app.use(cors())

const rawBodySaver = (req, res, buf, encoding) => {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || "utf8");
    }
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ verify: rawBodySaver }));

const upload = multer({ dest: 'uploads/' });

app.post('/saveImage', upload.single('image'), (req, res) => {
    try {
        const imageData = fs.readFileSync(req.file.path, 'base64');
        const folderPath = path.resolve(`${require('os').homedir()}/Desktop/payment`);

        console.log(req.file);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        fs.writeFileSync(`${folderPath}/image.png`, imageData, 'base64');

        res.send('Image saved successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});


app.post('/generateQR', (req, res) => {
    const amount = parseFloat(req.body.amount)
    const mobileNuber = '0613845551'
    const payload = generatePayload(mobileNuber, { amount })
    const option = {
        color: {
            dark: '#000',
            light: '#fff'
        }
    }
    qrCode.toDataURL(payload, option, (err, url) => {
        if (err) {
            console.log('generate fail')
            return res.status(400).json({
                RespCode: 400,
                RespMessage: err
            })
        }
        else {
            return res.status(200).json({
                RespCode: 200,
                RespMessage: 'good',
                Result: url
            })
        }
    })
})

// show all menu 
app.get('/menuitem', async function (req, res) {
    let results = await menuItem(res);
    res.json(results['recordsets'][0])
})

// add new menu
app.post('/addmenu', (req, res) => {
    let my_paylaod = {
        menuId: req.body.id,
        menuName: req.body.menuname,
        price: req.body.price,
        menuDetail: req.body.detail,
        menuType: req.body.type,
        menuPic: req.body.img
    };

    addMenu(res, my_paylaod)

})

// delete menu by id
app.delete('/menuitem/delete/:menuId', async function (req, res) {
    const id = req.params.menuId
    console.log(id)
    let results = await deleteMenu(res, parseInt(id))
    res.json(results)
})

// form for insert new menu
app.post("/menuitem/formsave", CustomerformsaveDataValidator, async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render("customer_formdata", {
            initData: req.body,
            errorData: errors.mapped(),
        });
    } else {
        let my_paylaod = {
            menuId: req.body.menuId,
            menuName: req.body.menuName,
            price: req.body.price,
            menuDetail: req.body.menuDetail,
            menuType: req.body.menuType,
            menuPic: req.body.menuPic
        };

        console.log("insert new menu: " + my_paylaod);
        await addMenu(res, my_paylaod)
    }
});

// get menu by category
app.get('/menuitem/:menuType', async function (req, res) {
    const menutype = req.params.menuType;
    console.log(menutype)
    if (menutype == '*') {
        let results = await menuItem(res)
        res.json(results['recordsets'][0])
    }
    else {
        let results = await MenuByType(res, menutype)
        res.json(results['recordsets'][0])
    }

})

// update price
app.put('/menuitem/update/:menuId', async function (req, res) {
    const id = req.params.menuId
    console.log(id)
    let my_paylaod = {
        menuId: req.body.menuId,
        price: req.body.price
    }

    console.log('upate point: ' + my_paylaod)
    await updatePrice(res, my_paylaod)
})

// get cafe info
app.get('/cafeinfo', async function (req, res) {
    let results = await cafeInfo(res);
    res.json(results['recordsets'][0])
})

// get cafe employee
app.get('/employee', async function (req, res) {
    let results = await employeeList(res);
    res.json(results['recordsets'][0])
})

// register new staff
app.post("/employee/formsave", AddStaffformsaveDataValidator, async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render("customer_formdata", {
            initData: req.body,
            errorData: errors.mapped(),
        });
    } else {
        let my_paylaod = {
            emId: req.body.emId,
            emName: req.body.emName,
            emEmail: req.body.emEmail,
            emPassword: req.body.emPassword
        };

        console.log("insert new user: " + my_paylaod);
        await AddEmployee(res, my_paylaod)
    }
});

// get customer list
app.get('/customer', async function (req, res) {
    let results = await CustomerList(res);
    res.json(results['recordsets'][0])
})

// register new customer
app.post("/customer/formsave", RegisterformsaveDataValidator, async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render("customer_formdata", {
            initData: req.body,
            errorData: errors.mapped(),
        });
    } else {
        let my_paylaod = {
            cusId: req.body.cusId,
            cusName: req.body.cusName,
            cusEmail: req.body.cusEmail,
            cusPassword: req.body.cusPassword,
            cusPoint: req.body.cusPoint,
        };

        console.log("insert new user: " + my_paylaod);
        await Register(res, my_paylaod)
    }
});

// delte customer by id
app.delete('/customer/delete/:cusId', async function (req, res) {
    const id = req.params.cusId
    console.log(id)
    let results = await deleteMember(res, parseInt(id))
    res.json(results)
})

// update point
app.put('/customer/update/:cusName', async function (req, res) {
    const name = req.params.cusName
    console.log(typeof (name))
    let my_payload = {
        cusName: req.body.cusName,
        cusPoint: req.body.cusPoint
    }

    console.log(`update point: ${my_payload}`)
    await updatePoint(res, my_payload)
})

// get cafe order
app.get('/cafeorder', async function (req, res) {
    let results = await cafeOrder(res);
    res.json(results['recordsets'][0])
})

// get cafe order by customer id
app.get('/cafeorder/:cusId', async function (req, res) {
    const id = req.params.cusId;
    let results = await cafeOrderById(res, parseInt(id))
    res.json(results['recordsets'][0])
})

app.put('/ordercafe/update/:orderId', async function (req, res) {
    const id = req.params.orderId
    let payload = {
        orderId: req.body.orderId,
        orderStatus: req.body.orderStatus
    }
    console.log(payload)
    let results = await updateStatus(res, payload)
    res.json(results['recordsets'])
})

// get menu statement
app.get('/cafeorder-statement', async function (req, res) {
    let results = await cafeOrderStatement(res);
    res.json(results['recordsets'][0]);
});

// get cafe income
app.get('/cafeorder-income', async function (req, res) {
    let results = await cafeOrderIncome(res)
    res.json(results['recordsets'][0])
})

// insert new cafe order
app.post("/cafeorder/formsave", OrderformsaveDataValidator, async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render("customer_formdata", {
            initData: req.body,
            errorData: errors.mapped(),
        });
    } else {
        let my_paylaod = {
            orderId: req.body.orderId,
            cusName: req.body.cusName,
            menuName: req.body.menuName,
            request: req.body.request,
            unit: req.body.unit,
            total: req.body.total
        };

        console.log("insert new menu: " + my_paylaod);
        await addOrder(res, my_paylaod)
    }
});

// delete order by id
app.delete('/cafeorder/delete/:orderId', async function (req, res) {
    const id = req.params.orderId
    console.log(id)
    let results = await deleteOrder(res, parseInt(id))
    res.json(results)
})

// get cafe comment
app.get('/cafecomment', async function (req, res) {
    let results = await cafeComment(res)
    res.json(results)
})

// add new comment
app.post("/cafecomment/formsave", CommentformsaveDataValidator, async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render("customer_formdata", {
            initData: req.body,
            errorData: errors.mapped(),
        });
    } else {
        let my_paylaod = {
            comName: req.body.comName,
            comBody: req.body.comBody
        };

        console.log("insert new comment: " + my_paylaod);
        await createComment(res, my_paylaod)
    }
});

app.get('/ordercafe', async function (req, res) {
    let results = await getOrderCafe(res)
    res.json(results['recordsets'][0])
})

// insert new cafe order
app.post("/ordercafe/formsave", OrderformsaveDataValidator, async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render("customer_formdata", {
            initData: req.body,
            errorData: errors.mapped(),
        });
    } else {
        let my_paylaod = {
            orderId: req.body.orderId,
            cusName: req.body.cusName,
            menuName: req.body.menuName,
            noTable: req.body.noTable,
            unit: req.body.unit,
            total: req.body.total,
            orderStatus: req.body.orderStatus
        };

        console.log("insert new menu: " + my_paylaod);
        await addOrder(res, my_paylaod)
    }
});

app.listen(process.env.PORT, () => {
    console.log("Server run at 127.0.0.1:" + process.env.PORT)
})