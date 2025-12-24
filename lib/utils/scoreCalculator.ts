/**
 * Calculate score based on answer time and correctness
 */
export function calculateScore(
  isCorrect: boolean,
  timeLimit: number,
  timeSpent: number
): number {
  if (!isCorrect) return 0;
  
  const baseScore = 100;
  const timeBonus = Math.max(0, ((timeLimit - timeSpent) / timeLimit) * 50);
  
  return Math.round(baseScore + timeBonus);
}

/**
 * Calculate final rank based on score
 */
export function calculateRank(score: number, totalQuestions: number): string {
  const percentage = (score / (totalQuestions * 150)) * 100;
  
  if (percentage >= 90) return 'Xuất sắc';
  if (percentage >= 75) return 'Giỏi';
  if (percentage >= 60) return 'Khá';
  if (percentage >= 50) return 'Trung bình';
  return 'Cần cố gắng';
}