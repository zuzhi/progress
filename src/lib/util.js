export const countTopics = (topics) => {
  let count = 0

  topics.forEach(topic => {
    count++ // Count the current topic
    if (topic.topics && topic.topics.length > 0) {
      count += countTopics(topic.topics) // Recursively count nested topics
    }
  })

  return count
}
