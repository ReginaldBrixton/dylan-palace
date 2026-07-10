import { render, screen } from '@testing-library/react';
import BrandLogo from './BrandLogo';

describe('BrandLogo', () => {
  it('renders an accessible wordmark by default', () => {
    render(<BrandLogo />);
    expect(screen.getByRole('img', { name: "Dylan's Palace" })).toBeInTheDocument();
  });

  it('renders every supported variant', () => {
    const { rerender } = render(<BrandLogo variant="monogram" title="DP monogram" />);
    expect(screen.getByRole('img', { name: 'DP monogram' })).toBeInTheDocument();
    rerender(<BrandLogo variant="symbol" title="Palace symbol" />);
    expect(screen.getByRole('img', { name: 'Palace symbol' })).toBeInTheDocument();
  });
});
