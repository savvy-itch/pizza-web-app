import { mockOrders, mockOrdersTooMany } from '../__mocks__/mockOrders';
import { displayOrderQuantity } from '../utils';


const localStorageMock = {
  getItem: jest.fn(),
};

let quantityDiv;

describe('displayOrderQuantity', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    localStorageMock.getItem.mockReset();
    quantityDiv = document.createElement('div');
    quantityDiv.className = 'order-quantity';
    document.body.appendChild(quantityDiv);
  });

  test('should be empty if no orders', () => {
    displayOrderQuantity();
    expect(quantityDiv.textContent).toBe('');    
  });

  test('should display the actual amount of orders', () => {
    const totalAmount = mockOrders.reduce((acc, val) => acc + val.amount, 0);
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockOrders));
    displayOrderQuantity();
    expect(quantityDiv.textContent).toBe((totalAmount).toString());
  });

  test('should display "9+" amount', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockOrdersTooMany));
    displayOrderQuantity();
    expect(quantityDiv.textContent).toBe('9+');
  });
})