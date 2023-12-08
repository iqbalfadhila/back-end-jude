<<<<<<< HEAD
const Category = require("../models/Category")
const { Op } = require('sequelize');

const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.findAll();
		res.json(categories);
	} catch (error) {
		console.error('Error getting categories:', error.message);
		res.status(500).json({ message: 'Internal Server Error' });
	}
}

const getCategoryById = async (req, res) => {
	const { id } = req.params;

	try {
		const category = await Category.findByPk(id);

		if (!category) {
			return res.status(404).json({ message: 'Category not found.' });
		}
		
		res.json(city);
	} catch (error) {
		console.error('Error getting category:', error.message);
		res.status(500).json({ message: 'Internal Server Error' });
	}
}

const createCategory = async (req, res) => {
	const { category_name } = req.body;

	try {
		
		if (!category_name) {
			return res.status(400).json({ message: 'The category field is required!' });
		}

		const existingCategory = await Category.findOne({ where: { category_name } });

		if (existingCategory) {
			return res.status(400).json({ message: 'The category already exists' })
		}

		const newCategory = await Category.create({ category_name });

		res.status(201).json(newCategory)

	} catch (error) {
		console.error('Error creating category:', error.message);
		res.status(500).json({ message: 'Internal Server Error' });
	}
}

const updateCategory = async (req, res) => {
	const { id } = req.params;
	const{ category_name } = req.body;

	try {
		if (!category_name) {
			return req.status(400).json({ message: 'The category field is required!' });
		}

		const CategoryToUpdate = await Category.findByPk(id);

		if (!CategoryToUpdate) {
			return res.status(404).json({ message: 'Category not found.' });
		}

		// Cek apakah provinsi dengan nama yang sama sudah ada (kecuali provinsi yang sedang diupdate)
    const existingCategory = await Category.findOne({
      where: {
        category_name,
        id: { [Op.not]: id }, // Exclude the current province being updated
      },
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'A category with that name already exists.' });
    }

    // Jika validasi berhasil, lakukan update pada provinsi
    await CategoryToUpdate.update({ category_name });
    res.json(CategoryToUpdate);
	} catch (error) {
		console.error('Error updating category:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
	}
}

const deleteCategory = async (req, res) => {
	const { id } = req.params;

	try {
		const existingCategory = await Category.findByPk(id);

		if (!existingCategory) {
			return res.status(404).json({ message: 'Category not found!' });
		}

		await existingCategory.destroy();
		res.json({ message: 'Category deleted successfully.' });
	} catch (error) {
		console.error('Error deleting category:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
	}
}

module.exports = { 
	getAllCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory
=======
const Category = require("../models/Category")
const { Op } = require('sequelize');

const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.findAll();
		res.json(categories);
	} catch (error) {
		console.error('Error getting categories:', error.message);
		res.status(500).json({ message: 'Internal Server Error' });
	}
}

const getCategoryById = async (req, res) => {
	const { id } = req.params;

	try {
		const category = await Category.findByPk(id);

		if (!category) {
			return res.status(404).json({ message: 'Category not found.' });
		}
		
		res.json(city);
	} catch (error) {
		console.error('Error getting category:', error.message);
		res.status(500).json({ message: 'Internal Server Error' });
	}
}

const createCategory = async (req, res) => {
	const { category_name } = req.body;

	try {
		
		if (!category_name) {
			return res.status(400).json({ message: 'The category field is required!' });
		}

		const existingCategory = await Category.findOne({ where: { category_name } });

		if (existingCategory) {
			return res.status(400).json({ message: 'The category already exists' })
		}

		const newCategory = await Category.create({ category_name });

		res.status(201).json(newCategory)

	} catch (error) {
		console.error('Error creating category:', error.message);
		res.status(500).json({ message: 'Internal Server Error' });
	}
}

const updateCategory = async (req, res) => {
	const { id } = req.params;
	const{ category_name } = req.body;

	try {
		if (!category_name) {
			return req.status(400).json({ message: 'The category field is required!' });
		}

		const CategoryToUpdate = await Category.findByPk(id);

		if (!CategoryToUpdate) {
      return res.status(404).json({ message: 'Category not found.' });
    }

		// Cek apakah provinsi dengan nama yang sama sudah ada (kecuali provinsi yang sedang diupdate)
    const existingCategory = await Category.findOne({
      where: {
        category_name,
        id: { [Op.not]: id }, // Exclude the current province being updated
      },
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'A category with that name already exists.' });
    }

    // Jika validasi berhasil, lakukan update pada provinsi
    await CategoryToUpdate.update({ category_name });
    res.json(CategoryToUpdate);
	} catch (error) {
		console.error('Error updating category:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
	}
}

const deleteCategory = async (req, res) => {
	const { id } = req.params;

	try {
		const existingCategory = await Category.findByPk(id);

		if (!existingCategory) {
			return res.status(404).json({ message: 'Category not found!' });
		}

		await existingCategory.destroy();
		res.json({ message: 'Category deleted successfully.' });
	} catch (error) {
		console.error('Error deleting category:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
	}
}

module.exports = { 
	getAllCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory
>>>>>>> a1de2a0618c3f9501131560ed1bb04cff20dd316
}