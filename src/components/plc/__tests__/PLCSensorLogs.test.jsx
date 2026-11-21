/**
 * Unit tests for PLCSensorLogs component
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PLCSensorLogs from '../PLCSensorLogs';

// Mock fetch
global.fetch = jest.fn();

describe('PLCSensorLogs Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the component with title', () => {
        // Mock empty logs response
        global.fetch.mockResolvedValue({
            json: async () => ({
                success: true,
                data: {
                    total: 0,
                    logs: [],
                    pagination: { limit: 50, offset: 0, hasMore: false }
                }
            })
        });

        render(<PLCSensorLogs />);

        expect(screen.getByText('PLC Sensor Logs')).toBeInTheDocument();
        expect(screen.getByText('View sensor activation history with filtering and statistics')).toBeInTheDocument();
    });

    it('should display filters and pagination controls', () => {
        global.fetch.mockResolvedValue({
            json: async () => ({
                success: true,
                data: {
                    total: 0,
                    logs: [],
                    pagination: { limit: 50, offset: 0, hasMore: false }
                }
            })
        });

        render(<PLCSensorLogs />);

        expect(screen.getByText('Rack ID')).toBeInTheDocument();
        expect(screen.getByText('Operation')).toBeInTheDocument();
        expect(screen.getByText('Start Date')).toBeInTheDocument();
        expect(screen.getByText('End Date')).toBeInTheDocument();
    });

    it('should fetch and display logs from API', async () => {
        const mockLogs = [
            {
                id: '1',
                timestamp: '2026-07-04T05:13:29.206Z',
                action: 'SensorActivated',
                item: 'SKU-001',
                rackId: 'S1-R05',
                plcOperation: 'SENSOR_ON',
                plcAddress: 23,
                plcValue: 'true',
                status: 'success',
                details: 'Sensor activated'
            }
        ];

        global.fetch.mockResolvedValue({
            json: async () => ({
                success: true,
                data: {
                    total: 1,
                    logs: mockLogs,
                    pagination: { limit: 50, offset: 0, hasMore: false }
                }
            })
        });

        render(<PLCSensorLogs />);

        await waitFor(() => {
            expect(screen.getByText('S1-R05')).toBeInTheDocument();
            expect(screen.getByText('SKU-001')).toBeInTheDocument();
        });
    });

    it('should display statistics when available', async () => {
        const mockStats = {
            totalOperations: 100,
            successRate: 95.5,
            averageResponseTime: 45,
            errorsByRack: { 'S1-R01': 2 },
            operationBreakdown: { SENSOR_ON: 50, SENSOR_OFF: 48, errors: 2 }
        };

        // Mock logs response
        global.fetch
            .mockResolvedValueOnce({
                json: async () => ({
                    success: true,
                    data: {
                        total: 0,
                        logs: [],
                        pagination: { limit: 50, offset: 0, hasMore: false }
                    }
                })
            })
            // Mock statistics response
            .mockResolvedValueOnce({
                json: async () => ({
                    success: true,
                    data: mockStats
                })
            });

        render(<PLCSensorLogs />);

        await waitFor(() => {
            expect(screen.getByText('100')).toBeInTheDocument();
            expect(screen.getByText('95.5%')).toBeInTheDocument();
            expect(screen.getByText('45ms')).toBeInTheDocument();
        });
    });

    it('should handle filter changes', async () => {
        global.fetch.mockResolvedValue({
            json: async () => ({
                success: true,
                data: {
                    total: 0,
                    logs: [],
                    pagination: { limit: 50, offset: 0, hasMore: false }
                }
            })
        });

        render(<PLCSensorLogs />);

        const rackSelect = screen.getByRole('combobox', { name: /rack id/i });
        fireEvent.change(rackSelect, { target: { value: 'S1-R05' } });

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('rackId=S1-R05')
            );
        });
    });

    it('should handle clear filters button', async () => {
        global.fetch.mockResolvedValue({
            json: async () => ({
                success: true,
                data: {
                    total: 0,
                    logs: [],
                    pagination: { limit: 50, offset: 0, hasMore: false }
                }
            })
        });

        render(<PLCSensorLogs />);

        const clearButton = screen.getByText('Clear Filters');
        fireEvent.click(clearButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });
    });

    it('should display error message when API fails', async () => {
        global.fetch
            .mockResolvedValueOnce({
                json: async () => ({
                    success: false,
                    message: 'Failed to fetch logs'
                })
            })
            .mockResolvedValueOnce({
                json: async () => ({
                    success: true,
                    data: {}
                })
            });

        render(<PLCSensorLogs />);

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch logs')).toBeInTheDocument();
        });
    });
});
