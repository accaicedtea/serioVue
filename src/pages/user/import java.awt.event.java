import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;
import javax.swing.JOptionPane;

public class ClientListener implements ActionListener {

    private static ClientFrame cf;

    public final String CONNECT = "CONNECT";
    public final String DISCONNECT = "DISCONNECT";
    public final String START = "START";
    public final String STOP = "STOP";

    private Socket sock;
    private PrintWriter pw;
    private Scanner sc;

    public ClientListener(ClientFrame cf) {
        this.cf = cf;
    }

    @Override
    public void actionPerformed(ActionEvent e) {

        if (e.getActionCommand().equals(CONNECT)) {

            try {
                this.setupConnection();
            } catch (IOException ex) {
                JOptionPane.showMessageDialog(null, "Impossibile connettersi");
                return;
            }

            this.cf.connected = true;
            this.cf.updateButtons();

        } else if (e.getActionCommand().equals(DISCONNECT)) {

            try {
                this.closeConnection();
            } catch (IOException ex) {
                JOptionPane.showMessageDialog(null, "Impossibile disconnettersi");
                return;
            }

            this.cf.connected = false;
            this.cf.updateButtons();

            this.pw.println("DISCONNECT");
            this.pw.flush();

        } else if (e.getActionCommand().equals(START)) {

            this.cf.started = true;
            this.cf.updateButtons();

            this.pw.println("START");
            this.pw.flush();

            Thread t = new Thread(new DownloaderThread(cf, sc));
            t.start();

        } else if (e.getActionCommand().equals(STOP)) {

            this.cf.started = false;
            this.cf.updateButtons();

            this.pw.println("STOP");
            this.pw.flush();

        }

    }

    public void setupConnection() throws IOException {
        this.sock = new Socket(this.cf.campoServerAddress.getText(),
                Integer.parseInt(this.cf.campoPort.getText()));
        this.pw = new PrintWriter(new OutputStreamWriter(this.sock.getOutputStream()));
        this.sc = new Scanner(this.sock.getInputStream());
    }

    public void closeConnection() throws IOException {
        this.sock.close();
        this.pw.close();
        this.sc.close();
    }

}
