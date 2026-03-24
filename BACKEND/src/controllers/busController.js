import Bus from '../models/Bus.js';

export const createBus = async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    res.status(201).json(bus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBusLocation = async (req, res) => {
  try {
    const { lat, lng, status } = req.body;
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      { currentLat: lat, currentLng: lng, status },
      { new: true }
    );
    res.status(200).json(bus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Bus removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
