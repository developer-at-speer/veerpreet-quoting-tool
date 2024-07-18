// app/api/inventory/route.ts

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
    const filePath = path.join(process.cwd(), 'data/inventory.xlsx');
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const data = new Uint8Array(fileBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetNames = workbook.SheetNames;
        const jsonResult: any = {};

        sheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            jsonResult[sheetName] = XLSX.utils.sheet_to_json(worksheet);
        });

        return NextResponse.json(jsonResult);
    } catch (error) {
        return NextResponse.json({ error: 'Error reading the Excel file' }, { status: 500 });
    }
}
