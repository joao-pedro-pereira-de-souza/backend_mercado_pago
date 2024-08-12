import { describe, it, expect  } from '@jest/globals';

describe('should tests main', () => {
    it('should test main', () => {
        const expected = () => {return 1 + 1;};
        expect(expected()).toEqual(2);
    });
});
