const tf = require('@tensorflow/tfjs-node');

async function trainAndRecommend() {
  // Sample data
  const mealsData = [
    { name: 'Jollof Rice', ingredients: ['rice', 'tomato', 'onion'], price: 5 },
    { name: 'Egusi Soup', ingredients: ['egusi seeds', 'leafy vegetables', 'meat'], price: 8 },
    { name: 'Suya', ingredients: ['beef', 'groundnut powder', 'spices'], price: 7 },
    // Add more meals
  ];

  // User preferences
  const userPreferences = 'rice tomato onion';

  // User budget
  const userBudget = 10;

  // Vectorize data
  const vectorizer = tf.text
    .vectorize(docs => docs.map(d => d.ingredients.join(' ')))
    .fit([mealsData]);

  // Convert data to tensors
  const mealsTensor = vectorizer.transform([mealsData]);
  const userPreferencesTensor = vectorizer.transform([userPreferences]);

  // Compute similarity scores
  const similarityScores = tf.losses.cosineDistance(mealsTensor, userPreferencesTensor, 0);

  // Sort meals by similarity score
  const sortedIndices = similarityScores.argMin().dataSync();

  // Filter meals based on budget
  const recommendedMeals = mealsData.filter((meal, index) => meal.price <= userBudget && sortedIndices.includes(index));

  // Display recommended meals
  console.log('Recommended Meals:');
  recommendedMeals.forEach(meal => {
    console.log(`${meal.name} - $${meal.price}`);
  });
}

// Run the recommendation system
trainAndRecommend();
