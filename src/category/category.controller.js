import Category from '../category/category.model.js'

export const add = async (req, res) => {
    try {
        let data = req.body
        let existingCategory = await Category.findOne({ name: data.name });
        if (existingCategory) {
            return res.status(400).send({ message: 'Sorry, there is already a category with the same name' });
        }
        let category = new Category(data)
        await category.save()
        return res.send({ message: 'The category was crated' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Umm something was wrong' })
    }
}