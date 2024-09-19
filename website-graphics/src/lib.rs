//#![no_std]

use core::sync::atomic::{AtomicU32, Ordering};

const WIDTH: usize = 600;
const HEIGHT: usize = 600;

static FRAME: AtomicU32 = AtomicU32::new(0);

#[no_mangle]
static mut BUFFER: [u32; WIDTH * HEIGHT] = [0; WIDTH * HEIGHT];

/*
#[panic_handler]
fn handle_panic(_: &core::panic::PanicInfo) -> ! {
    loop {}
}
    */

fn render_frame_safe(buffer: &mut [u32; WIDTH * HEIGHT]) {
    let f = FRAME.fetch_add(1, Ordering::Relaxed);

    for y in 0..HEIGHT {
        for x in 0..WIDTH {
            buffer[y * WIDTH + x] = 
                f.wrapping_add((x ^ y) as u32) | 0xFF_00_00_00;
        }
    }
}

#[no_mangle]
pub unsafe extern fn go() {
    render_frame_safe(&mut BUFFER)
}

#[no_mangle]
pub extern fn the_answer() -> u32 {
    42
}

#[no_mangle]
pub extern fn test_mouse(x: u32, y: u32) -> u32 {
    x
}

#[no_mangle]
pub extern "C" fn ripple_effect(x: f32, y: f32, time: f32) -> f32 {
    let d = ((x - 0.5).powi(2) + (y - 0.5).powi(2)).sqrt();
    let ripple = (10.0 * (d - time * 2.0)).sin() * (-d * 10.0).exp();
    ripple
}