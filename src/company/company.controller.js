import Company from '../company/company.model.js'
import Category from '../category/category.model.js'
import { checkUpdate } from '../../utils/validator.js'
import ExcelJS from 'exceljs'

export const add = async (req, res) => {
    try {
        let data = req.body
        let category = await Category.findOne({ _id: data.category })
        if (!category) return res.status(404).send({ message: 'The category was not found' })
        let company = new Company(data)
        await company.save()
        return res.send({ message: 'The company was created' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Umm something was wrong' })
    }
}

export const update = async (req, res) => {
    try {
        let data = req.body
        let { id } = req.params
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'It seems like you are missing something' })
        let updated = await Company.findOneAndUpdate(
            { _id: id },data,{ new: true }
        ).populate('category')
        if (!updated) return res.status(401).send({ message: 'The company was not found' })
        return res.send({ message: 'Product updated', updated })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Umm something was wrong' })
    }
}

export const fltAtoZ = async (req, res) => {
    try {
        const companies = await Company.find().sort({ name: 1 });
        return res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Umm something was wrong', error: error });
    }
}

export const fltZtoA = async (req, res) => {
    try {
        const companies = await Company.find().sort({ name: -1 });
        return res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Umm something was wrong', error: error });
    }
}

export const fltExpYr = async (req, res) => {
    try {
        const companies = await Company.find().sort({ yearExp: -1 });
        return res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Umm something was wrong', error: error });
    }
}

export const fltImpct = async (req, res) => {
    try {
        const companies = await Company.find().sort({ impact: 1 });
        return res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Umm something was wrong', error: error });
    }
}

export const createExcel = async(req, res)=>{
    try {
        let company = await Company.find().populate('category', ['name', 'description'])
        let excelBook = new ExcelJS.Workbook()
        let sheet = excelBook.addWorksheet('Company')
        sheet.columns =[
            {header: 'Name', key: 'name', width: 20},
            {header: 'Impact', key: 'impact', width: 20},
            {header: 'Year of Experience', key: 'yearExp', width: 20},
            {header: 'Category', key: 'category', width: 20},
            {header: 'Description', key: 'description', width: 20},
        ]
        company.forEach(company =>{
            sheet.addRow({
                name: company.name,
                impact: company.impact,
                yearExp: company.yearExp,
                category: company.category.name,
                description: company.category.description
            })
        })
        let filePath = 'COPEREX.xlsx'
        await excelBook.xlsx.writeFile(filePath)
        res.attachment(filePath)
        res.send()
    }  catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Umm something was wrong', err: err });
    }
}
