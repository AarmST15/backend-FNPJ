const sql = require("mssql")
const _ = require('lodash')
require('dotenv').config()
const string_connection = `Server=${process.env.DB_SERVER}, ${process.env.DB_PORT};Database=${process.env.DB_NAME};User Id=${process.env.DB_USER};Password=${process.env.DB_PWD};Encrypt=false`;

const menuItem = async (res) => {
    // console.log ("string")
    try {
        let con = await sql.connect(string_connection)
        // console.log ("connect")
        let request = new sql.Request(con);
        const result = await request.query('select * from Menu')
        return result
    }
    catch (err) {
        console.log(string_connection)
        res.status(500).send('Error connecting to the database')
    }
    finally {
        await sql.close();
    }
    // console.log ("connect fin")
}


const addMenu = async (res, playload) => {

    try {

        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        console.log(playload)

        const result = await request.input('menuId', sql.Int, playload.menuId).
            input('menuName', sql.NVarChar, playload.menuName).
            input('price', sql.Int, playload.price).
            input('menuDetail', sql.NVarChar, playload.menuDetail).
            input('menuType', sql.NVarChar, playload.menuType).
            input('menuPic', sql.NVarChar, playload.menuPic).

            query('insert into dbo.Menu (menuId, menuName, price, menuDetail, menuType, menuPic) \
        values(@menuId,@menuName,@price,@menuDetail,@menuType,@menuPic)');

        console.log('Rows affected:', result.rowsAffected[0]);

        return result.rowsAffected[0];
    }
    catch (err) {
        res.status(500).send(err);

    } finally {
        await sql.close();
    }
}

const updatePrice = async (res, playload) => {
    try {

        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        console.log(playload)

        const result = await request.input('menuId', sql.Int, playload.menuId)
            .input('price', sql.Int, playload.price)
            .query('update dbo.Menu set price=@price where menuId=@menuId');

        console.log('Rows affected:', result.rowsAffected[0]);

        return result.rowsAffected[0];
    }
    catch (err) {
        res.status(500).send(err);

    } finally {
        await sql.close();
    }
}


const deleteMenu = async (res, menuId) => {
    try {
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        const result = await request.query('delete from Menu where menuId = ' + (menuId))
        return result
    }
    catch (err) {
        console.log(string_connection)
        res.status(500).send('Error connecting to the database')
    }
    finally {
        await sql.close();
    }
}

const MenuByType = async (res, menuType) => {
    try {
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        const result = await request.query("select * from Menu where menuType = '" + menuType + "'")
        return result
    }
    catch (err) {
        console.log(string_connection)
        res.status(500).send('Error connecting to the database')
    }
    finally {
        await sql.close();
    }
}

const cafeInfo = async (res) => {
    try {
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        const result = await request.query('select * from cafeInfo')
        return result
    }
    catch (err) {
        console.log(string_connection)
        res.status(500).send('Error connecting to the database')
    }
    finally {
        await sql.close();
    }
}

const employeeList = async (res) => {
    try {
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        const result = await request.query('select * from Employee')
        return result
    }
    catch (err) {
        console.log(string_connection)
        res.status(500).send('Error connecting to the database')
    }
    finally {
        await sql.close();
    }
}

const AddEmployee = async (res, playload) => {

    try {

        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        console.log(playload)

        const result = await request.input('emId', sql.Int, playload.emId).
            input('emName', sql.NVarChar, playload.emName).
            input('emEmail', sql.NVarChar, playload.emEmail).
            input('emPassword', sql.NVarChar, playload.emPassword).

            query('insert into dbo.Employee (emId, emName, emEmail, emPassword) \
        values(@emId,@emName,@emEmail,@emPassword)');

        console.log('Rows affected:', result.rowsAffected[0]);

        return result.rowsAffected[0];
    }
    catch (err) {
        res.status(500).send(err);

    } finally {
        await sql.close();
    }
}

const CustomerList = async (res) => {
    try {
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        const result = await request.query('select * from Customer')
        return result
    }
    catch (err) {
        console.log(string_connection)
        res.status(500).send('Error connecting to the database')
    }
    finally {
        await sql.close();
    }
}

const Register = async (res, playload) => {

    try {

        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        console.log(playload)

        const result = await request.input('cusId', sql.Int, playload.cusId).
            input('cusName', sql.NVarChar, playload.cusName).
            input('cusEmail', sql.NVarChar, playload.cusEmail).
            input('cusPassword', sql.NVarChar, playload.cusPassword).
            input('cusPoint', sql.Int, playload.cusPoint).

            query('insert into dbo.Customer (cusId, cusName, cusEmail, cusPassword, cusPoint) \
        values(@cusId,@cusName,@cusEmail,@cusPassword,@cusPoint)');

        console.log('Rows affected:', result.rowsAffected[0]);

        return result.rowsAffected[0];
    }
    catch (err) {
        res.status(500).send(err);

    } finally {
        await sql.close();
    }
}

const deleteMember = async (res, cusId) => {
    try {
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        const result = await request.query('delete from Customer where cusId = ' + (cusId))
        return result
    }
    catch (err) {
        console.log(string_connection)
        res.status(500).send('Error connecting to the database')
    }
    finally {
        await sql.close();
    }
}

const updatePoint = async (res, payload) => {
    try {
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        console.log(payload)

        const result = await request
            .input('cusName', sql.NVarChar, payload.cusName)
            .input('cusPoint', sql.Int, payload.cusPoint)
            .query("update dbo.Customer set cusPoint=cusPoint+@cusPoint where cusName= @cusName");

        console.log('Rows affected:', result.rowsAffected[0]);

        return result.rowsAffected[0];
    } catch (err) {
        res.status(500).send(err);
    } finally {
        await sql.close();
    }
}


const cafeOrder = async (res) => {
    try {
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        const result = await request.query('select * from cafeOrder')
        return result
    }
    catch (err) {
        console.log(string_connection)
        res.status(500).send('Error connecting to the database')
    }
    finally {
        await sql.close();
    }
}

const cafeOrderIncome = async (res) => {
    try {
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        const result = await request.query('select sum(unit) as total_unit, sum(total) as total_income from cafeOrder')
        return result
    }
    catch (err) {
        console.log(string_connection)
        res.status(500).send('Error connecting to the database')
    }
    finally {
        await sql.close();
    }
}

const cafeOrderStatement = async (res) => {
    try {
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        const result = await request.query('select m.menuName, m.price, m.menuType, sum(o.unit) as total_order, sum(o.total) as total_price from Menu m, orderCafe o where m.menuName = o.menuName Group by m.menuName, m.price, m.menuType')
        return result
    }
    catch (err) {
        console.log(string_connection)
        res.status(500).send('Error connecting to the database')
    }
    finally {
        await sql.close();
    }
}

const cafeOrderById = async (res, id) => {
    try {
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        const result = await request.query('select * from cafeOrder where cusId = ' + (id))
        return result
    }
    catch (err) {
        console.log(string_connection)
        res.status(500).send('Error connecting to the database')
    }
    finally {
        await sql.close();
    }
}


const addOrder = async (res, payload) => {

    try {

        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        console.log(payload)

        const result = await request.input('orderId', sql.Int, payload.orderId).
            input('cusName', sql.NVarChar, payload.cusName).
            input('menuName', sql.NVarChar, payload.menuName).
            input('noTable', sql.Int, payload.noTable).
            input('unit', sql.Int, payload.unit).
            input('total', sql.Int, payload.total).
            input('orderStatus', sql.NVarChar, payload.orderStatus).

            query("insert into dbo.orderCafe (orderId, orderDate, cusName, menuName, noTable, unit, total, orderStatus) \
        values(@orderId,getdate(),@cusName,@menuName,@noTable, @unit, @total,@orderStatus)");


        console.log('Rows affected:', result.rowsAffected[0]);

        return result.rowsAffected[0];
    }
    catch (err) {
        res.status(500).send(err);

    } finally {
        await sql.close();
    }
}

const deleteOrder = async (res, orderId) => {
    try {
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        const result = await request.query('delete from cafeOrder where orderId = ' + (orderId))
        return result
    }
    catch (err) {
        console.log(string_connection)
        res.status(500).send('Error connecting to the database')
    }
    finally {
        await sql.close();
    }
}

const cafeComment = async (res) => {
    try {
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        const result = await request.query('select * from Comment')
        return result
    }
    catch (err) {
        console.log(string_connection)
        res.status(500).send('Error connecting to the database')
    }
    finally {
        await sql.close();
    }
}

const createComment = async (res, playload) => {

    try {

        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        console.log(playload)

        const result = await request.input('comName', sql.NVarChar, playload.comName).
            input('comBody', sql.NText, playload.comBody).

            query('insert into dbo.Comment (comName, comBody) \
        values(@comName,@comBody)');

        console.log('Rows affected:', result.rowsAffected[0]);

        return result.rowsAffected[0];
    }
    catch (err) {
        res.status(500).send(err);

    } finally {
        await sql.close();
    }
}

const updateStatus = async (res, payload) => {
    try {

        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        console.log(payload)

        const result = await request.input('orderId', sql.Int, payload.orderId).
            input('orderStatus', sql.NVarChar, payload.orderStatus).

            query("update dbo.orderCafe set orderStatus=@orderStatus where orderId=@orderId");

        console.log('Rows affected:', result.rowsAffected[0]);

        return result.rowsAffected[0];
    }
    catch (err) {
        res.status(500).send(err);

    } finally {
        await sql.close();
    }
}

const getOrderCafe = async (res) => {
    try {
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        const result = await request.query('select * from orderCafe')
        return result
    }
    catch (err) {
        console.log(string_connection)
        res.status(500).send('Error connecting to the database')
    }
    finally {
        await sql.close();
    }
}

module.exports = {
    menuItem, deleteMenu,
    MenuByType,
    cafeInfo,
    employeeList, AddEmployee,
    CustomerList,
    cafeOrder, cafeOrderById,
    cafeOrderStatement,
    cafeOrderIncome,
    addMenu, addOrder,
    updatePrice,
    deleteOrder, updatePoint,
    Register, deleteMember,
    cafeComment, createComment,
    updateStatus,
    getOrderCafe
}