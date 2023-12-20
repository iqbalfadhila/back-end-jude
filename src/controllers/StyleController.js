const { Op } = require("sequelize");
const Style = require("../models/Style");

const getAllStyle = async (req, res) => {
   try {
      const styles = await Style.findAll();
      res.json(styles);
   } catch (error) {
      console.error('Error Getting Styles', error.message);
      res.status(500).json({ message: 'Internal Server Error' })
   }
};

const getStyleById = async (req, res) => {
   const { id } = req.params;
   try {
      const style = await Style.findByPk(id);

      if (!style) {
         return res.status(200).json({ message: 'Style not found!' });
      }

      res.json(style)
   } catch (error) {
      console.error('Error Getting Style!', error.message);
      res.status(500).json({ message: 'Internal Server Error!' });
   }
};

const createStyle = async (req, res) => {
   const { style_name } = req.body;

   try {
      
      if (!style_name) {
         return res.status(400).json({ message: 'Style field required!' })
      }

      const existingStyle = await Style.findOne({ where: { style_name } });

      if (existingStyle) {
         return res.status(400).json({ message: 'Style already exists!' });
      }

      const newStyle = await Style.create({ style_name });

      res.status(201).json(newStyle);

   } catch (error) {
      console.error('Error Created Style!', error.message);
      res.status(500).json({ message: 'Internal Server Error!' })
   }
}

const updateStyle = async (req, res) => {
   const { id } = req.params;
   const { style_name } = req.body;

   try {

      if (!style_name) {
         return res.status(400).json({ message: 'Style field required!' });
      }

      const styleToUpdate = await Style.findByPk(id);

      if (!styleToUpdate) {
         return res.status(404).json({ message: 'Style not found!' });
      }

      const existingStyle = await Style.findOne({
         where: {
            style_name,
            id: { [Op.not]: id},
         }
      });

      if (existingStyle) {
         return res.status(400).json({ message: 'The style name already exists' })
      }

      await styleToUpdate.update({style_name});

      res.json(styleToUpdate)

   } catch (error) {
      console.error('Error updating style:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
   }
}

const deleteStyle = async (req, res) => {
   const { id } = req.params;

   try {
      const existingStyle = await Style.findByPk(id);

      if (!existingStyle) {
         return res.status(404).json({ message: 'Style not found!' });
      }

      await existingStyle.destroy();
      res.json({ message: 'Style deleted successfully.' });
   } catch (error) {
      console.error('Error deleting style:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
   }
}

module.exports = {
   getAllStyle,
   getStyleById,
   createStyle,
   updateStyle,
   deleteStyle
};