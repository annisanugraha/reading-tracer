import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { RatingStars } from './RatingStars';

const meta = {
  component: RatingStars,
  tags: ['ai-generated'],
} satisfies Meta<typeof RatingStars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeStars: Story = {
  args: { value: 3, readOnly: true, ariaLabel: 'Rating 3 dari 5' },
};

export const FiveStars: Story = {
  args: { value: 5, readOnly: true },
};

export const ZeroStars: Story = {
  args: { value: 0, readOnly: true },
};

export const HalfStar: Story = {
  args: { value: 3.5, readOnly: true },
};

export const Interactive: Story = {
  args: {
    value: 0,
    onChange: fn(),
    ariaLabel: 'Pilih rating',
  },
};

export const SmallSize: Story = {
  args: { value: 4, readOnly: true, size: 'sm' },
};

export const LargeSize: Story = {
  args: { value: 4, readOnly: true, size: 'lg' },
};
