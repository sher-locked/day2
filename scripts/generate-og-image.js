import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a canvas with dimensions for a social media card
async function createSocialImage() {
  // Set dimensions
  const width = 1200;
  const height = 630;
  
  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Set background color (dark theme)
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(91, 38, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(33, 150, 243, 0.2)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Draw a radial gradient for top left glow
  ctx.beginPath();
  const gradientTopLeft = ctx.createRadialGradient(
    width * 0.3, height * 0.2, 0,
    width * 0.3, height * 0.2, width * 0.4
  );
  gradientTopLeft.addColorStop(0, 'rgba(91, 38, 255, 0.4)');
  gradientTopLeft.addColorStop(1, 'transparent');
  ctx.fillStyle = gradientTopLeft;
  ctx.arc(width * 0.3, height * 0.2, width * 0.4, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw a radial gradient for bottom right glow
  ctx.beginPath();
  const gradientBottomRight = ctx.createRadialGradient(
    width * 0.7, height * 0.6, 0,
    width * 0.7, height * 0.6, width * 0.3
  );
  gradientBottomRight.addColorStop(0, 'rgba(33, 150, 243, 0.3)');
  gradientBottomRight.addColorStop(1, 'transparent');
  ctx.fillStyle = gradientBottomRight;
  ctx.arc(width * 0.7, height * 0.6, width * 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // BETA badge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  const badgeX = width / 2 - 40;
  ctx.roundRect(badgeX, 100, 80, 36, 18);
  ctx.fill();
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('BETA', width / 2, 125);
  
  // Main title
  ctx.font = 'bold 82px Arial';
  ctx.textAlign = 'center';
  
  // Create gradient for title text
  const textGradient = ctx.createLinearGradient(width / 2 - 300, 0, width / 2 + 300, 0);
  textGradient.addColorStop(0, '#ffffff');
  textGradient.addColorStop(1, '#90caf9');
  ctx.fillStyle = textGradient;
  
  ctx.fillText('Clarifi Workbench', width / 2, 220);
  
  // Subtitle
  ctx.font = '32px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('Compare LLMs for Reasoning Outputs', width / 2, 280);
  
  // Feature cards
  const cardWidth = 220;
  const cardHeight = 60;
  const cardPadding = 24;
  const startX = width / 2 - (cardWidth * 3 + cardPadding * 2) / 2;
  const startY = 360;
  
  // Feature 1
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.beginPath();
  ctx.roundRect(startX, startY, cardWidth, cardHeight, 12);
  ctx.fill();
  
  ctx.fillStyle = '#90caf9'; // Blue
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Test Multiple Models', startX + cardWidth / 2, startY + cardHeight / 2 + 7);
  
  // Feature 2
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.beginPath();
  ctx.roundRect(startX + cardWidth + cardPadding, startY, cardWidth, cardHeight, 12);
  ctx.fill();
  
  ctx.fillStyle = '#ce93d8'; // Purple
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Structured Output', startX + cardWidth + cardPadding + cardWidth / 2, startY + cardHeight / 2 + 7);
  
  // Feature 3
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.beginPath();
  ctx.roundRect(startX + (cardWidth + cardPadding) * 2, startY, cardWidth, cardHeight, 12);
  ctx.fill();
  
  ctx.fillStyle = '#81c784'; // Green
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Token Usage Monitoring', startX + (cardWidth + cardPadding) * 2 + cardWidth / 2, startY + cardHeight / 2 + 7);
  
  // How to get started section
  ctx.fillStyle = 'rgba(91, 38, 255, 0.15)';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 300, 460, 600, 120, 16);
  ctx.fill();
  
  // Section title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('How to get started:', width / 2 - 280, 495);
  
  // Steps
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '18px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('1. Paste your text in the input area', width / 2 - 280, 530);
  ctx.fillText('2. Select models to compare', width / 2 - 280, 555);
  
  // Export image
  const buffer = canvas.toBuffer('image/jpeg');
  const outputPath = path.join(__dirname, '../public/clarifi-og.jpg');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Image saved to ${outputPath}`);
}

createSocialImage().catch(console.error); 